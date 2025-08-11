using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMiraclesModel3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miracles_Saints_SaintId",
                table: "Miracles");

            migrationBuilder.DropIndex(
                name: "IX_Miracles_SaintId",
                table: "Miracles");

            migrationBuilder.DropColumn(
                name: "SaintId",
                table: "Miracles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SaintId",
                table: "Miracles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Miracles_SaintId",
                table: "Miracles",
                column: "SaintId");

            migrationBuilder.AddForeignKey(
                name: "FK_Miracles_Saints_SaintId",
                table: "Miracles",
                column: "SaintId",
                principalTable: "Saints",
                principalColumn: "Id");
        }
    }
}
