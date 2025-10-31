using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DeleteIsFreeIsPublished : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFree",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "IsFree",
                table: "Terms");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Terms");

            migrationBuilder.DropColumn(
                name: "URL",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "IsFree",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Lessons");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFree",
                table: "Units",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Units",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFree",
                table: "Terms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Terms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "URL",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsFree",
                table: "Lessons",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Lessons",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
