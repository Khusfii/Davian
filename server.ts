import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // API route for RSVP
  app.post("/api/rsvp", async (req, res) => {
    const { name, attendance } = req.body;

    console.log("RSVP Received:", { name, attendance });

    try {
      // Setup email transporter
      // For real usage, user should provide SMTP credentials in .env
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER || "mock_user",
          pass: process.env.SMTP_PASS || "mock_pass",
        },
      });

      const mailOptions = {
        from: '"Khitanan Invitation" <invitation@khitanan.com>',
        to: "jatraxstore@gmail.com",
        subject: `RSVP Baru: ${name}`,
        text: `Nama: ${name}\nKehadiran: ${attendance === "hadir" ? "Hadir" : "Tidak Hadir"}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #001b3d;">Konfirmasi Kehadiran Baru</h2>
            <p><strong>Nama Lengkap:</strong> ${name}</p>
            <p><strong>Status Kehadiran:</strong> ${attendance === "hadir" ? '<span style="color: green;">Hadir</span>' : '<span style="color: red;">Tidak Hadir</span>'}</p>
          </div>
        `,
      };

      // In a real environment, we'd send the email.
      // For this demo, we log the intent and return success.
      // If credentials exist, it will actually attempt to send.
      if (process.env.SMTP_USER) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log("Email would be sent to jatraxstore@gmail.com with content:", mailOptions.text);
      }

      res.status(200).json({ success: true, message: "RSVP sent successfully!" });
    } catch (error) {
      console.error("Error sending RSVP:", error);
      res.status(500).json({ success: false, message: "Failed to send RSVP." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
