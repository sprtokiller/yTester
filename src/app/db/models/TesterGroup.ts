import { Model, Column, Table, ForeignKey } from "sequelize-typescript";
import { Group } from "./Group";
import { Tester } from "./Tester";

@Table
export class TesterGroup extends Model {

  @ForeignKey(() => Group)
  @Column
  groupUUID!: number;

  @ForeignKey(() => Tester)
  @Column
  testerUUID!: number;
}