"""Test the two student data structures"""
import string
import random

from check_missing_form import RegisteredStudent, FormSubmittedStudent
from check_missing_form import same_student


def random_string(n):
    return "".join(
        random.choice(string.ascii_letters + string.digits) for i in range(n)
    )


def test_same_student_should_return_true_for_same_named_students():
    fake_first_name = random_string(8)
    fake_last_name = random_string(12)
    fake_class_name = random_string(4)
    registered_student = RegisteredStudent(
        fake_first_name,
        fake_last_name,
        fake_class_name,
        random_string(5),
        random_string(10),
    )
    form_submitted_student = FormSubmittedStudent(
        fake_first_name,
        fake_last_name,
        fake_class_name,
        random_string(6),
        random_string(7),
    )
    assert same_student(registered_student, form_submitted_student)


def test_same_student_should_return_false_for_students_with_different_first_name():
    fake_last_name = random_string(12)
    fake_class_name = random_string(4)
    registered_student = RegisteredStudent(
        random_string(8),
        fake_last_name,
        fake_class_name,
        random_string(5),
        random_string(10),
    )
    form_submitted_student = FormSubmittedStudent(
        random_string(9),
        fake_last_name,
        fake_class_name,
        random_string(6),
        random_string(7),
    )
    assert not same_student(registered_student, form_submitted_student)


def test_same_student_should_return_false_for_students_with_different_last_name():
    fake_first_name = random_string(8)
    fake_class_name = random_string(4)
    registered_student = RegisteredStudent(
        fake_first_name,
        random_string(12),
        fake_class_name,
        random_string(5),
        random_string(10),
    )
    form_submitted_student = FormSubmittedStudent(
        fake_first_name,
        random_string(13),
        fake_class_name,
        random_string(6),
        random_string(7),
    )
    assert not same_student(registered_student, form_submitted_student)


def test_same_student_should_return_false_for_students_with_different_class_name():
    fake_first_name = random_string(8)
    fake_last_name = random_string(12)
    registered_student = RegisteredStudent(
        fake_first_name,
        fake_last_name,
        random_string(4),
        random_string(5),
        random_string(10),
    )
    form_submitted_student = FormSubmittedStudent(
        fake_first_name,
        fake_last_name,
        random_string(3),
        random_string(6),
        random_string(7),
    )
    assert not same_student(registered_student, form_submitted_student)
