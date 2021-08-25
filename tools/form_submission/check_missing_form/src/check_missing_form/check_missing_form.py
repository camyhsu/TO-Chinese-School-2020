from collections import namedtuple

import csv

REGISTERED_STUDENTS_CSV_FILE = "students_by_class.csv"
FORM_SUBMITTED_STUDENTS_CSV_FILE = "WellnessChecklistAcknowledgment.csv"

RegisteredStudent = namedtuple(
    "RegisteredStudent",
    ["first_name", "last_name", "class_name", "family_email", "family_phone"],
)

FormSubmittedStudent = namedtuple(
    "FormSubmittedStudent",
    ["first_name", "last_name", "class_name", "submission_email", "timestamp"],
)


def same_student(registered_student, form_submitted_student):
    if (
        registered_student.first_name != form_submitted_student.first_name
        or registered_student.last_name != form_submitted_student.last_name
        or registered_student.class_name != form_submitted_student.class_name
    ):
        return False
    else:
        return True


def normalize_class_name(input_class_name):
    if input_class_name == "PreA":
        return "PreK A"
    else:
        return input_class_name


def read_registered_students_from_csv(registered_students_csv_file_path):
    with registered_students_csv_file_path.open() as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        registered_students = []
        for row in csv_reader:
            if line_count == 0:
                # print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                registered_students.append(
                    RegisteredStudent(
                        row[1], row[2], normalize_class_name(row[0]), row[6], row[7]
                    )
                )
                line_count += 1

    print(f"Processed {line_count} lines.")
    print(f"{len(registered_students)} registered students collected.")
    return registered_students


def read_form_submitted_students_from_csv(form_submitted_students_csv_file_path):
    with form_submitted_students_csv_file_path.open() as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        form_submitted_students = []
        for row in csv_reader:
            if line_count == 0:
                # print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                form_submitted_students.append(
                    FormSubmittedStudent(
                        row[3].strip(), row[2].strip(), row[4], row[1].strip(), row[0]
                    )
                )
                line_count += 1

    print(f"Processed {line_count} lines.")
    print(f"{len(form_submitted_students)} registered students collected.")
    return form_submitted_students


def check_registered_against_submitted(registered_students, form_submitted_students):
    matched_registered_students = []
    registered_students_without_submitted_form = []
    for registered_student in registered_students:
        found_submitted_form = False
        for form_submitted_student in form_submitted_students:
            if same_student(registered_student, form_submitted_student):
                matched_registered_students.append(registered_student)
                found_submitted_form = True
                break
        if not found_submitted_form:
            registered_students_without_submitted_form.append(registered_student)
    return (matched_registered_students, registered_students_without_submitted_form)


# if __name__ == "__main__":
#     main()
