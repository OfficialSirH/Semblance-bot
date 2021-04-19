import { Document, Model } from "mongoose";
import { AfkFormat } from "./Afk";
import { GameFormat } from "./Game";
import { InformationFormat } from "./Information";
import { JumpFormat } from "./Jump";
import { ReminderFormat } from "./Reminder";
import { ReportFormat } from "./Report";
import { UserDataFormat } from "./UserData";
import { VotesFormat } from "./Votes";


export const MODELS: MODELS;

type MODELS = Record<ModelType, ModelFormat>;

type ModelType = 'Afk'
    | 'Game'
    | 'Information'
    | 'Jump'
    | 'Reminder'
    | 'Report'
    | 'UserData'
    | 'Votes';

type DocumentType = AfkFormat
    | GameFormat
    | InformationFormat
    | JumpFormat
    | ReminderFormat
    | ReportFormat
    | UserDataFormat
    | VotesFormat;

type ModelFormat = Model<DocumentType>;