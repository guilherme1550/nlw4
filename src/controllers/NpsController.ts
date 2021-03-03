import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from "../errors/AppError";


class NpsController {
    async execute(request: Request, response: Response) {

        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        //Pego as pesquisas respondidas referente ao id da pesquisa
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        if (surveysUsers.length === 0) {
            throw new AppError("Surveys Users does not exists or the surveys was not answered");
        }

        const detractors = surveysUsers.filter((surveyUser) =>
            surveyUser.value >= 0 && surveyUser.value <= 6
        ).length

        const promoters = surveysUsers.filter(
            (surveyUser) => surveyUser.value >= 9 && surveyUser.value <= 10
        ).length

        const passive = surveysUsers.filter(
            (surveyUser) => surveyUser.value >= 7 && surveyUser.value <= 8
        ).length

        const totalAnswers = surveysUsers.length;

        const nps = Number(
            (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractors,
            promoters,
            passive,
            totalAnswers,
            nps
        });
    }
}


export { NpsController }