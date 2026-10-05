import { Request, Response } from "express";

const FAQ_ITEMS = [
  {
    id: "documents",
    question: "faq.q1.question",
    answer: "faq.q1.answer",
  },
  {
    id: "delai",
    question: "faq.q2.question",
    answer: "faq.q2.answer",
  },
  {
    id: "taux",
    question: "faq.q3.question",
    answer: "faq.q3.answer",
  },
];

// GET /api/faq
// Renvoie des clés de traduction : le frontend affiche le texte
// dans la langue choisie via i18n plutôt qu'un texte figé côté serveur.
export function getFaq(req: Request, res: Response) {
  res.json(FAQ_ITEMS);
}
