using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMiraclesModel2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MiracleTag_Miracles_MiraclesId",
                table: "MiracleTag");

            migrationBuilder.DropForeignKey(
                name: "FK_MiracleTag_Tags_TagsId",
                table: "MiracleTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MiracleTag",
                table: "MiracleTag");

            migrationBuilder.RenameTable(
                name: "MiracleTag",
                newName: "MiracleTags");

            migrationBuilder.RenameIndex(
                name: "IX_MiracleTag_TagsId",
                table: "MiracleTags",
                newName: "IX_MiracleTags_TagsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MiracleTags",
                table: "MiracleTags",
                columns: new[] { "MiraclesId", "TagsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MiracleTags_Miracles_MiraclesId",
                table: "MiracleTags",
                column: "MiraclesId",
                principalTable: "Miracles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MiracleTags_Tags_TagsId",
                table: "MiracleTags",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MiracleTags_Miracles_MiraclesId",
                table: "MiracleTags");

            migrationBuilder.DropForeignKey(
                name: "FK_MiracleTags_Tags_TagsId",
                table: "MiracleTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MiracleTags",
                table: "MiracleTags");

            migrationBuilder.RenameTable(
                name: "MiracleTags",
                newName: "MiracleTag");

            migrationBuilder.RenameIndex(
                name: "IX_MiracleTags_TagsId",
                table: "MiracleTag",
                newName: "IX_MiracleTag_TagsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MiracleTag",
                table: "MiracleTag",
                columns: new[] { "MiraclesId", "TagsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MiracleTag_Miracles_MiraclesId",
                table: "MiracleTag",
                column: "MiraclesId",
                principalTable: "Miracles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MiracleTag_Tags_TagsId",
                table: "MiracleTag",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
