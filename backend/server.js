const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const DB_PATH = path.join(__dirname, "db.json");

// читаем db.json
async function readDB() {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

// ---------- Swagger ----------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Employees API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         id: { type: string, example: "1" }
 *         employee: { type: string, example: "Saltanat Rakhim" }
 *         organization: { type: string, example: "ИП Алматы" }
 *         object: { type: string, example: "кафе" }
 *         projects:
 *           type: array
 *           items: { type: string }
 *           example: ["POS-инфраструктура"]
 *         position: { type: string, example: "Barista/Cashier" }
 *         hireDate: { type: string, example: "2023-05-09" }
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Получить список сотрудников
 *     responses:
 *       200:
 *         description: Массив сотрудников
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
app.get("/api/employees", async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.employees || []);
  } catch (e) {
    res.status(500).json({ message: "Не удалось прочитать db.json" });
  }
});

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});