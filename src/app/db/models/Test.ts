import { Model, Column, Table, BelongsTo, ForeignKey, PrimaryKey, AllowNull, IsUUID, CreatedAt, IsIn, DataType, HasOne } from "sequelize-typescript";
import { Course } from "./Course";
import { EndType } from "../../utils";
import { Module_1 } from "./Module_1";

@Table
export class Test extends Model {

  @IsUUID(4)
  @PrimaryKey
  @Column
  testUUID!: string;

  @Column
  name!: string;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column
  courseUUID!: string;

  @BelongsTo(() => Course)
  course!: Course;

  @CreatedAt
  @Column
  createdAt!: Date;
  
  @Column
  startAt?: Date;

  @IsIn([Object.values(EndType)])
  @Column({
    type: DataType.ENUM(...Object.values(EndType)),
    defaultValue: EndType.MANUAL,
    allowNull: false
  })
  endType!: EndType;

  @Column
  endAt?: Date;

  @HasOne(() => Module_1)
  m1?: Module_1;
}