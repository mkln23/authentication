import { Column, Entity } from "typeorm";

import BaseSerialEntity from "./Base.entity";

@Entity({ name: "users" })
export class Users extends BaseSerialEntity {
  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  mobile!: string | null;

  @Column({ type: "varchar", nullable: false, select: false })
  password!: string;
}
