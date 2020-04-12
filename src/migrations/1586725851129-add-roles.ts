import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddRoles1586725851129 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const hasRoleTable = await queryRunner.hasTable('role');

    if (!hasRoleTable) {
      await queryRunner.createTable(
        new Table({
          name: 'role',
          columns: [
            { name: 'id', type: 'int', isPrimary: true },
            { name: 'name', type: 'text', isUnique: true },
          ],
        }),
        /* ifNotExists */ true,
        /* createForeignKeys */ true,
        /* createIndices */ true,
      );
    }

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('role')
      .values([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Manager' },
        { id: 3, name: 'User' },
      ])
      .execute();
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.clearTable('role');
  }
}
