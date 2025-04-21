import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    return new Promise((resolve, reject) => {
      const ollamaProcess = spawn("ollama", ["run", "gemma3:1b"]);

      let responseText = "";
      ollamaProcess.stdout.on("data", (data) => {
        responseText += data.toString();
      });

      ollamaProcess.stderr.on("data", (data) => {
        console.error(`Gemma Thinking.. ${data}`);
      });

      ollamaProcess.on("close", () => {
        resolve(NextResponse.json({ reply: responseText.trim() }));
      });

      ollamaProcess.stdin.write(message + "\n");
      ollamaProcess.stdin.end();
    });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
