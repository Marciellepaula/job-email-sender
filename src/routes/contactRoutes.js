import { Router } from "express";
import { contactController } from "../controllers/contactController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createContactSchema, updateContactSchema } from "../validators/contactValidator.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: List all contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts list
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContact'
 *     responses:
 *       201:
 *         description: Contact created
 *       409:
 *         description: Email already exists
 */
router.get("/", contactController.findAll);
router.post("/", validate(createContactSchema), contactController.create);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Get contact by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact data
 *       404:
 *         description: Contact not found
 *   put:
 *     tags: [Contacts]
 *     summary: Update contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateContact'
 *     responses:
 *       200:
 *         description: Contact updated
 *       404:
 *         description: Contact not found
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 */
router.get("/:id", contactController.findById);
router.put("/:id", validate(updateContactSchema), contactController.update);
router.delete("/:id", contactController.delete);

export default router;
