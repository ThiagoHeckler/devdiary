import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1791725176928 implements MigrationInterface {
  name = 'InitialSchema1791725176928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`slug\` varchar(220) NOT NULL, \`excerpt\` varchar(300) NOT NULL, \`content\` mediumtext NOT NULL, \`coverImageUrl\` varchar(500) NULL, \`tags\` json NOT NULL, \`status\` enum ('draft', 'published') NOT NULL DEFAULT 'draft', \`publishedAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_54ddf9075260407dcfdd724857\` (\`slug\`), INDEX \`IDX_a129c9a63a96ac7da3d1170a6b\` (\`status\`, \`publishedAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_a129c9a63a96ac7da3d1170a6b\` ON \`posts\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_54ddf9075260407dcfdd724857\` ON \`posts\``,
    );
    await queryRunner.query(`DROP TABLE \`posts\``);
  }
}
