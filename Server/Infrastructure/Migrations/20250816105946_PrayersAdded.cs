using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PrayersAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Prayers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MarkdownPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prayers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrayerTags",
                columns: table => new
                {
                    PrayersId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrayerTags", x => new { x.PrayersId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_PrayerTags_Prayers_PrayersId",
                        column: x => x.PrayersId,
                        principalTable: "Prayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrayerTags_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PrayerTags_TagsId",
                table: "PrayerTags",
                column: "TagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrayerTags");

            migrationBuilder.DropTable(
                name: "Prayers");
        }
    }
}
