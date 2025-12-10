import { faker } from '@faker-js/faker';
import type { FactorizedAttrs } from '@jorgebodega/typeorm-factory';
import { Factory } from '@jorgebodega/typeorm-factory';
import type { DataSource, EntityManager } from 'typeorm';

import { Users } from '@/database/entities/User.entity';
import { UserStatus } from '@/enums/userStatus.enums';

export class UserFactory extends Factory<Users> {
    protected entity = Users;
    protected dataSource;

    constructor(datasource: DataSource) {
        super();
        this.dataSource = datasource;
    }

    protected getEntityManager(): EntityManager {
        return this.dataSource.manager;
    }

    protected attrs(): FactorizedAttrs<Users> {
        return {
            name: faker.person.fullName(),
            mobile: faker.string.numeric(10), //TODO: verify format
            email: faker.internet.email(),
            password: faker.internet.password({ length: 12 }),
            mfaSecret: faker.word.sample(6),
            status: UserStatus.ACTIVE,
        };
    }
}
