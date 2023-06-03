import { Model, Column, Table, BelongsTo, ForeignKey, PrimaryKey, AllowNull, IsUUID, CreatedAt, IsIn, DataType, HasOne, HasMany, BelongsToMany } from "sequelize-typescript";
import { EndType } from "../../utils";
import { AnonymousTester } from "./AnonymousTester";
import { Tester } from "./Tester";
import { TesterTest } from "./TesterTest";
import { Course } from "./Course";
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

  @BelongsTo(() => Course, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
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

  @BelongsToMany(() => Tester, () => TesterTest)
  testers?: Tester[];

  @HasMany(() => AnonymousTester)
  anonymousTesters?: AnonymousTester[];

  @HasOne(() => Module_1, { onDelete: 'CASCADE' })
  m1?: Module_1;
}

const MODULE_COUNT = 1;

export function getModules(test: Test): number[] {
  const modules: number[] = [];

  for (let i = 1; i <= MODULE_COUNT; i++) {
      const key = `m${i}` as keyof Test;
      if (test[key]) {
          modules.push(i);
      }
  }
  return modules;
}