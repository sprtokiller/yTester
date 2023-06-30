import { EndType, ContentType } from "./utils";

export interface ICourse {
  courseUUID: string;
  name: string;
  author: string;
  version: number;
  groupHash: string;
}

export interface ITimeSpan {
  startAt?: Date;
  endAt?: Date;
}

export interface ICourseView extends ICourse {
  tests: ITimeSpan[];
  contentType: ContentType;
}

export interface ICourseDetail extends ICourse {
  courseLocation: string;
  tests?: ITestView[];
  otherVersions?: ICourse[];
}

export interface ITest {
  testUUID: string;
  name: string;
  courseUUID: string;
  createdAt: Date;
  startAt?: Date;
  endType: EndType;
  endAt?: Date;
}

export interface ITestView extends ITest {
  modules?: number[];
}

export interface ITestDetail extends ITest {
  anonymousTesters?: IAnonymousTester[];
  testers?: ITester[];
}

export interface IAnonymousTester {
  anonymousTesterUUID: string
}

export interface ITester {
  testerUUID: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface IGroup {
  groupName: string;
  groupUUID: string;
}

export interface IGroupView extends IGroup {
  groupTestersCount: number;
}

export interface IXVerb {
  verbID: string;
  display: string;
}

export interface IXObject {
  objectID: string;
  objectType: string;
  name: string;
}

export interface IXRecord {
  recordUUID: string;
  testerUUID: string;
  verbID: string;
  objectID: string;
  testUUID: string;
  success?: boolean;
  completion?: boolean;
  duration?: string; //ISO_8601
  response?: string;
  scoreScaled?: number;
  scoreRaw?: number;
  scoreMin?: number;
  scoreMax?: number;
  timestamp: Date;
}

export interface IXRecordView extends IXRecord {
  verb: IXVerb;
  object: IXObject;
}