import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"
import { AppError } from "../errors/AppError";


class AnswersController {
    
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        //Pego a pesquisa no banco pelo id da pesquisa
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        })

        if (!surveyUser) {
            throw new AppError("Survey User does not exists");
        }
        else if(surveyUser.value !== null) {
            throw new AppError("Note cannot be changed");
        }
    
        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser)
    }
}

export { AnswersController }