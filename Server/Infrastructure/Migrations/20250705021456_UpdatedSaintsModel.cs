using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedSaintsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "FeastDay",
                table: "Saints",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatronOf",
                table: "Saints",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReligiousOrderId",
                table: "Saints",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Saints",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TagId",
                table: "Miracles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ReligiousOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReligiousOrders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TagType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SaintTags",
                columns: table => new
                {
                    SaintsId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaintTags", x => new { x.SaintsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_SaintTags_Saints_SaintsId",
                        column: x => x.SaintsId,
                        principalTable: "Saints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SaintTags_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Saints_ReligiousOrderId",
                table: "Saints",
                column: "ReligiousOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Miracles_TagId",
                table: "Miracles",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_SaintTags_TagsId",
                table: "SaintTags",
                column: "TagsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Miracles_Tags_TagId",
                table: "Miracles",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Saints_ReligiousOrders_ReligiousOrderId",
                table: "Saints",
                column: "ReligiousOrderId",
                principalTable: "ReligiousOrders",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miracles_Tags_TagId",
                table: "Miracles");

            migrationBuilder.DropForeignKey(
                name: "FK_Saints_ReligiousOrders_ReligiousOrderId",
                table: "Saints");

            migrationBuilder.DropTable(
                name: "ReligiousOrders");

            migrationBuilder.DropTable(
                name: "SaintTags");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Saints_ReligiousOrderId",
                table: "Saints");

            migrationBuilder.DropIndex(
                name: "IX_Miracles_TagId",
                table: "Miracles");

            migrationBuilder.DropColumn(
                name: "FeastDay",
                table: "Saints");

            migrationBuilder.DropColumn(
                name: "PatronOf",
                table: "Saints");

            migrationBuilder.DropColumn(
                name: "ReligiousOrderId",
                table: "Saints");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Saints");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "Miracles");
        }
    }
}
