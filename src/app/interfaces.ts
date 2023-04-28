import { EndType } from "./utils";

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
}

export interface ICourseDetail extends ICourse {
  courseHash: string;
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

export interface ITester {
  userUUID: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface ITesterGroup {
  name: string;
  userUUIDs: ITester[];
  groupUUID: string;
  colorID: number;
}
