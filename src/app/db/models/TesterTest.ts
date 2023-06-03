import { Model, Column, Table, ForeignKey } from "sequelize-typescript";
import { Test } from "./Test";
import { Tester } from "./Tester";

@Table
export class TesterTest extends Model {

  @ForeignKey(() => Test)
  @Column
  testUUID!: string;

  @ForeignKey(() => Tester)
  @Column
  testerUUID!: string;
}