/*
export interface Course {
  courseID: number;
  name: string;
  author: string;
  version: number;
  groupHash: string;
  courseHash: string;
}
*/

import {Model, Column, Table, CreatedAt, UpdatedAt} from "sequelize-typescript";

// @Scopes(() => ({
//   movies: {
//     include: [
//       {
//         model: Movie,
//         through: {attributes: []},
//       },
//     ],
//   },
// }))
@Table
export class Course extends Model {

  @Column
  courseID!: number;

  @Column
  name!: string;

  @Column
  author!: string;

  @Column
  version!: number;

  @Column
  groupHash!: string;

  @Column
  courseHash!: string;

  // @BelongsToMany(() => Movie, () => MovieActor)
  // movies?: Movie[];


}