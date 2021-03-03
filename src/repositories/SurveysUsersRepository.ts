import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";
import { Request, Response } from "express";

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser> {
    
}

export { SurveysUsersRepository };
