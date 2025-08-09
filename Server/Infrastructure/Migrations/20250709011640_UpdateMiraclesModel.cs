using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMiraclesModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miracles_Tags_TagId",
                table: "Miracles");

            migrationBuilder.RenameColumn(
                name: "TagId",
                table: "Miracles",
                newName: "SaintId");

            migrationBuilder.RenameIndex(
                name: "IX_Miracles_TagId",
                table: "Miracles",
                newName: "IX_Miracles_SaintId");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "Miracles",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationDetails",
                table: "Miracles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MiracleTag",
                columns: table => new
                {
                    MiraclesId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MiracleTag", x => new { x.MiraclesId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_MiracleTag_Miracles_MiraclesId",
                        column: x => x.MiraclesId,
                        principalTable: "Miracles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MiracleTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MiracleTag_TagsId",
                table: "MiracleTag",
                column: "TagsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Miracles_Saints_SaintId",
                table: "Miracles",
                column: "SaintId",
                principalTable: "Saints",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miracles_Saints_SaintId",
                table: "Miracles");

            migrationBuilder.DropTable(
                name: "MiracleTag");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Miracles");

            migrationBuilder.DropColumn(
                name: "LocationDetails",
                table: "Miracles");

            migrationBuilder.RenameColumn(
                name: "SaintId",
                table: "Miracles",
                newName: "TagId");

            migrationBuilder.RenameIndex(
                name: "IX_Miracles_SaintId",
                table: "Miracles",
                newName: "IX_Miracles_TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Miracles_Tags_TagId",
                table: "Miracles",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");
        }
    }
}
