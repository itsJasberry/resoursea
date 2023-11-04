"user server";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";
import { usePathname } from "next/navigation";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  const path = usePathname();
  console.log(path);

  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = new Answer({ content, author, question });

    // Add the answer to the question's answers array

    await Question.findByIdAndUpdate(question, {
        $push: { answers: newAnswer._id}
    })

    revalidatePath(path); // to jest po to by po dodaniu nowego komentarza 
    // odświerzyło sie automatycznie page, poniewa bez tego trzeba odświerzyć stronę
    // aby sie pokazał nowy komentarz

  } catch (error) {
    console.log(error);
    throw error;
  }
};
