"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = new Answer({ content, author, question });

    // Add the answer to the question's answers array

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    newAnswer.save();

    revalidatePath(path); // to jest po to by po dodaniu nowego komentarza
    // odświerzyło sie automatycznie page, poniewa bez tego trzeba odświerzyć stronę
    // aby sie pokazał nowy komentarz
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
