"""Test the check submission functionality"""
import pathlib

from check_missing_form import RegisteredStudent
from check_missing_form import (
    read_registered_students_from_csv,
    read_form_submitted_students_from_csv,
    check_registered_against_submitted,
)

TEST_DIRECTORY_PATH = pathlib.Path(__file__).parent.parent.resolve()
SAMPLE_INPUT_FILE_PATH_REGISTERED_STUDENTS = (
    TEST_DIRECTORY_PATH / "data" / "sample_registered_students.csv"
)
SAMPLE_INPUT_FILE_PATH_FORM_SUBMITTED_STUDENTS = (
    TEST_DIRECTORY_PATH / "data" / "sample_form_submitted_students.csv"
)


def test_check_registered_against_submitted():
    registered_students = read_registered_students_from_csv(
        SAMPLE_INPUT_FILE_PATH_REGISTERED_STUDENTS
    )
    form_submitted_students = read_form_submitted_students_from_csv(
        SAMPLE_INPUT_FILE_PATH_FORM_SUBMITTED_STUDENTS
    )
    (
        matched_registered_students,
        registered_students_without_submitted_form,
    ) = check_registered_against_submitted(registered_students, form_submitted_students)
    assert len(matched_registered_students) == 2
    assert matched_registered_students[0] == RegisteredStudent(
        "Bowen", "Song", "3B", "jpqrs@hotmail.com", "(408) 567-5891"
    )
    assert matched_registered_students[1] == RegisteredStudent(
        "Angela", "Hua", "6C", "yyzzxx78@icloud.com", "(805) 890-5776"
    )
    assert len(registered_students_without_submitted_form) == 8
