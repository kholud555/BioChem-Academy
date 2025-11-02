using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaTypeAndFileFormatEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "Medias");

            migrationBuilder.AlterColumn<int>(
                name: "MediaType",
                table: "Medias",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "FileFormat",
                table: "Medias",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileFormat",
                table: "Medias");

            migrationBuilder.AlterColumn<string>(
                name: "MediaType",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
