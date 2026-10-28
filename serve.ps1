# High-performance, multi-threaded Static Web Server for Jose Ashmitha's QA Portfolio
param(
    [int]$Port = 8080,
    [string]$RootDir = $PSScriptRoot
)

$csharpCode = @"
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

public class PortfolioServer
{
    private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { ".html", "text/html; charset=utf-8" },
        { ".htm",  "text/html; charset=utf-8" },
        { ".css",  "text/css; charset=utf-8" },
        { ".js",   "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".png",  "image/png" },
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".gif",  "image/gif" },
        { ".svg",  "image/svg+xml" },
        { ".pdf",  "application/pdf" },
        { ".mp4",  "video/mp4" },
        { ".ico",  "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2", "font/woff2" },
        { ".ttf",  "font/ttf" }
    };

    public static void Run(int port, string rootDir)
    {
        rootDir = Path.GetFullPath(rootDir);
        TcpListener listener = new TcpListener(IPAddress.Any, port);
        listener.Start();

        while (true)
        {
            try
            {
                TcpClient client = listener.AcceptTcpClient();
                Task.Run(() => HandleClient(client, rootDir));
            }
            catch { }
        }
    }

    private static void HandleClient(TcpClient client, string rootDir)
    {
        try
        {
            using (client)
            using (NetworkStream stream = client.GetStream())
            {
                stream.ReadTimeout = 15000;
                stream.WriteTimeout = 15000;

                byte[] buffer = new byte[8192];
                int read = stream.Read(buffer, 0, buffer.Length);
                if (read <= 0) return;

                string req = Encoding.UTF8.GetString(buffer, 0, read);
                string[] lines = req.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
                if (lines.Length == 0) return;

                string[] tokens = lines[0].Split(' ');
                if (tokens.Length < 2) return;

                string rawUrl = tokens[1];
                int qIdx = rawUrl.IndexOf('?');
                if (qIdx >= 0) rawUrl = rawUrl.Substring(0, qIdx);

                string urlPath = Uri.UnescapeDataString(rawUrl);
                if (urlPath == "/" || string.IsNullOrWhiteSpace(urlPath)) urlPath = "/index.html";

                string relPath = urlPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                string fullPath = Path.GetFullPath(Path.Combine(rootDir, relPath));

                string canonicalRoot = rootDir.TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
                if (!fullPath.StartsWith(canonicalRoot, StringComparison.OrdinalIgnoreCase) && fullPath != rootDir)
                {
                    byte[] forbidden = Encoding.UTF8.GetBytes("HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
                    stream.Write(forbidden, 0, forbidden.Length);
                    return;
                }

                if (File.Exists(fullPath))
                {
                    string ext = Path.GetExtension(fullPath);
                    string contentType = MimeTypes.ContainsKey(ext) ? MimeTypes[ext] : "application/octet-stream";

                    using (FileStream fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        long length = fs.Length;
                        long start = 0;
                        long end = length - 1;
                        bool isRange = false;

                        long rStart = 0;
                        long rEnd = 0;
                        foreach (string line in lines)
                        {
                            if (line.StartsWith("Range: bytes=", StringComparison.OrdinalIgnoreCase))
                            {
                                string rangeVal = line.Substring(13).Trim();
                                string[] parts = rangeVal.Split('-');
                                if (parts.Length > 0 && !string.IsNullOrEmpty(parts[0]) && long.TryParse(parts[0], out rStart))
                                {
                                    start = rStart;
                                    isRange = true;
                                }
                                if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1]) && long.TryParse(parts[1], out rEnd))
                                {
                                    end = rEnd;
                                    isRange = true;
                                }
                                break;
                            }
                        }

                        if (isRange)
                        {
                            if (end >= length) end = length - 1;
                            long rangeLength = end - start + 1;
                            fs.Seek(start, SeekOrigin.Begin);
                            string header = "HTTP/1.1 206 Partial Content\r\nContent-Type: " + contentType + "\r\nContent-Range: bytes " + start + "-" + end + "/" + length + "\r\nContent-Length: " + rangeLength + "\r\nAccept-Ranges: bytes\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n";
                            byte[] headerBytes = Encoding.ASCII.GetBytes(header);
                            stream.Write(headerBytes, 0, headerBytes.Length);

                            byte[] chunk = new byte[65536];
                            long bytesRemaining = rangeLength;
                            while (bytesRemaining > 0)
                            {
                                int toRead = (int)Math.Min(chunk.Length, bytesRemaining);
                                int readBytes = fs.Read(chunk, 0, toRead);
                                if (readBytes <= 0) break;
                                stream.Write(chunk, 0, readBytes);
                                bytesRemaining -= readBytes;
                            }
                        }
                        else
                        {
                            string header = "HTTP/1.1 200 OK\r\nContent-Type: " + contentType + "\r\nContent-Length: " + length + "\r\nAccept-Ranges: bytes\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n";
                            byte[] headerBytes = Encoding.ASCII.GetBytes(header);
                            stream.Write(headerBytes, 0, headerBytes.Length);
                            fs.CopyTo(stream);
                        }
                    }
                }
                else
                {
                    byte[] body = Encoding.UTF8.GetBytes("<html><body><h2>404 - Not Found</h2></body></html>");
                    string header = "HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\nContent-Length: " + body.Length + "\r\nConnection: close\r\n\r\n";
                    byte[] headerBytes = Encoding.ASCII.GetBytes(header);
                    stream.Write(headerBytes, 0, headerBytes.Length);
                    stream.Write(body, 0, body.Length);
                }
            }
        }
        catch { }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -Language CSharp
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [Portfolio Server] Running on port $Port" -ForegroundColor Green
Write-Host " [Local URL]       http://127.0.0.1:$Port" -ForegroundColor Cyan
Write-Host " [Root Directory]  $RootDir" -ForegroundColor Gray
Write-Host " Press Ctrl+C in this terminal window to stop the server." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

[PortfolioServer]::Run($Port, $RootDir)
