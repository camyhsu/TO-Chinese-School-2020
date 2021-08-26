"""Test the output writing for the specific CSV formats used in this script"""
import filecmp
import pathlib

from check_missing_form import RegisteredStudent
from check_missing_form import (
    write_missing_form_students_to_csv,
)

TEST_DIRECTORY_PATH = pathlib.Path(__file__).parent.parent.resolve()
SAMPLE_OUTPUT_FILE_PATH_MISSING_FORM_STUDENTS = (
    TEST_DIRECTORY_PATH / "data" / "sample_missing_form_students.csv"
)
TEST_OUTPUT_DESTINATION_FILE_PATH = (
    TEST_DIRECTORY_PATH / "data" / "test_output_missing_form_students.csv"
)


def test_writing_output_to_file():
    registered_students_without_submitted_form = [
        RegisteredStudent(
            "Caden", "Chang", "PreK A", "abcsai@gmail.com", "(818) 123-9588"
        ),
        RegisteredStudent("Bowen", "Song", "3B", "jpqrs@hotmail.com", "(408) 567-5891"),
        RegisteredStudent(
            "Angela", "Hua", "6C", "yyzzxx78@icloud.com", "(805) 890-5776"
        ),
    ]
    write_missing_form_students_to_csv(
        TEST_OUTPUT_DESTINATION_FILE_PATH, registered_students_without_submitted_form
    )
    assert filecmp.cmp(
        TEST_OUTPUT_DESTINATION_FILE_PATH, SAMPLE_OUTPUT_FILE_PATH_MISSING_FORM_STUDENTS
    )
