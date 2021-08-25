"""Test the input parsing for the specific CSV formats used in this script"""
import pathlib
import string
import random

from check_missing_form import RegisteredStudent, FormSubmittedStudent
from check_missing_form import (
    normalize_class_name,
    read_registered_students_from_csv,
    read_form_submitted_students_from_csv,
)

UNIT_TEST_DIRECTORY_PATH = pathlib.Path(__file__).parent.resolve()
SAMPLE_INPUT_FILE_PATH_REGISTERED_STUDENTS = (
    UNIT_TEST_DIRECTORY_PATH / "data" / "sample_registered_students.csv"
)
SAMPLE_INPUT_FILE_PATH_FORM_SUBMITTED_STUDENTS = (
    UNIT_TEST_DIRECTORY_PATH / "data" / "sample_form_submitted_students.csv"
)


def random_string(n):
    return "".join(
        random.choice(string.ascii_letters + string.digits) for i in range(n)
    )


def test_normalize_class_name_should_convert_prek_class_name():
    assert normalize_class_name("PreA") == "PreK A"


def test_normalize_class_name_should_leave_other_class_name_unchanged():
    fake_class_name = random_string(3)
    assert normalize_class_name(fake_class_name) == fake_class_name


def test_input_csv_parsing_for_registered_students():
    registered_students = read_registered_students_from_csv(
        SAMPLE_INPUT_FILE_PATH_REGISTERED_STUDENTS
    )
    assert len(registered_students) == 10
    assert registered_students[0] == RegisteredStudent(
        "Caden", "Chang", "PreK A", "abcsai@gmail.com", "(818) 123-9588"
    )
    assert registered_students[9] == RegisteredStudent(
        "Angela", "Hua", "6C", "yyzzxx78@icloud.com", "(805) 890-5776"
    )


def test_input_csv_parsing_for_form_submitted_students():
    form_submitted_students = read_form_submitted_students_from_csv(
        SAMPLE_INPUT_FILE_PATH_FORM_SUBMITTED_STUDENTS
    )
    assert len(form_submitted_students) == 8
    assert form_submitted_students[0] == FormSubmittedStudent(
        "Leia", "Kao", "PreK A", "abc1022@gmail.com", "2021/08/21 9:03:06 AM MDT"
    )
    assert form_submitted_students[7] == FormSubmittedStudent(
        "Evan", "Chow", "EC2", "xyzllan@gmail.com", "2021/08/23 9:08:25 AM MDT"
    )
