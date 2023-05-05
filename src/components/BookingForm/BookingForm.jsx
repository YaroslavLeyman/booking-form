import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Select, DatePicker, Button, Input, Tooltip } from "antd";
import * as Yup from "yup";
import styles from "./BookingForm.module.css";

const { Option } = Select;
const { TextArea } = Input;

const initialValues = {
  tower: "",
  floor: "",
  room: "",
  date: "",
  timeRange: "",
  comment: "",
};

const validationSchema = Yup.object().shape({
  tower: Yup.string().required("Выберите башню"),
  floor: Yup.number().min(3).max(27).required("Выберите этаж"),
  room: Yup.number().min(1).max(10).required("Выберите переговорную"),
  date: Yup.string().required("Выберите дату"),
  timeRange: Yup.string().required("Выберите интервал времени"),
});

const BookingForm = () => {
  const [formState, setFormState] = useState({
    isFloorEnabled: false,
    isRoomEnabled: false,
    isDateEnabled: false,
    isTimeRangeEnabled: false,
    dateValue: null,
  });

  const onSubmit = (values) => {
    console.log(JSON.stringify(values, null, 2));
  };

  const handleReset = (resetForm) => {
    setFormState({
      isFloorEnabled: false,
      isRoomEnabled: false,
      isDateEnabled: false,
      isTimeRangeEnabled: false,
      dateValue: null,
    });
    resetForm(initialValues);
  };

  return (
    <div className={styles.wrapper}>
      <h1>Бронирование переговорной</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, setFieldTouched, resetForm, touched, values }) => (
          <Form className={styles.formContainer}>
            <div className={styles.formRow}>
              <label htmlFor="tower">Выберите башню:</label>
              <Field
                as={Select}
                className={styles.select}
                name="tower"
                onChange={(value) => {
                  setFieldValue("tower", value);
                  setFieldTouched("tower", true);
                  setFormState((prevState) => ({
                    ...prevState,
                    isFloorEnabled: !!value,
                  }));
                }}
              >
                <Option value=""></Option>
                <Option value="A">A</Option>
                <Option value="Б">Б</Option>
              </Field>
            </div>
            <ErrorMessage
              name="tower"
              component="div"
              className={styles.error}
            />
            <div className={styles.span}></div>

            <div className={styles.formRow}>
              <label htmlFor="floor">Выберите этаж:</label>
              <Field
                as={Select}
                className={styles.select}
                disabled={!formState.isFloorEnabled}
                name="floor"
                onChange={(value) => {
                  setFieldValue("floor", value);
                  setFieldTouched("floor", true);
                  setFormState((prevState) => ({
                    ...prevState,
                    isRoomEnabled: !!value,
                  }));
                }}
              >
                <Option value=""></Option>
                {[...Array(25)].map((_, index) => (
                  <Option key={index + 3} value={index + 3}>
                    {index + 3}
                  </Option>
                ))}
              </Field>
            </div>
            <ErrorMessage
              name="floor"
              render={(msg) =>
                touched.floor && !values.floor ? (
                  <div className={styles.error}>{msg}</div>
                ) : null
              }
            />
            <div className={styles.span}></div>

            <div className={styles.formRow}>
              <label htmlFor="room">Выберите переговорную:</label>
              <Field
                as={Select}
                className={styles.select}
                disabled={!formState.isRoomEnabled}
                name="room"
                onChange={(value) => {
                  setFieldValue("room", value);
                  setFieldTouched("room", true);
                  setFormState((prevState) => ({
                    ...prevState,
                    isDateEnabled: !!value,
                  }));
                }}
              >
                <Option value=""></Option>
                {[...Array(10)].map((_, index) => (
                  <Option key={index + 1} value={index + 1}>
                    {index + 1}
                  </Option>
                ))}
              </Field>
            </div>
            <ErrorMessage
              name="room"
              render={(msg) =>
                touched.room && !values.room ? (
                  <div className={styles.error}>{msg}</div>
                ) : null
              }
            />
            <div className={styles.span}></div>

            <label htmlFor="date">Выберите дату:</label>
            <DatePicker
              name="date"
              disabled={!formState.isDateEnabled}
              value={formState.dateValue}
              onChange={(date) => {
                const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                setFieldValue("date", formattedDate);
                setFieldTouched("date", true);
                setFormState((prevState) => ({
                  ...prevState,
                  isTimeRangeEnabled: !!date,
                  dateValue: date,
                }));
              }}
            />
            <ErrorMessage
              name="date"
              render={(msg) =>
                touched.date && !values.date ? (
                  <div className={styles.error}>{msg}</div>
                ) : null
              }
            />

            <label htmlFor="timeRange">Выберите интервал времени:</label>
            <Field
              as={Select}
              name="timeRange"
              disabled={!formState.isTimeRangeEnabled}
              onChange={(value) => {
                setFieldValue("timeRange", value);
                setFieldTouched("timeRange", true);
              }}
            >
              <Option value=""></Option>
              <Option value="9:00 - 13:00">9:00 - 13:00</Option>
              <Option value="13:00 - 16:00">13:00 - 16:00</Option>
              <Option value="16:00 - 18:00">16:00 - 18:00</Option>
            </Field>
            <ErrorMessage
              name="timeRange"
              render={(msg) =>
                touched.timeRange && !values.timeRange ? (
                  <div className={styles.error}>{msg}</div>
                ) : null
              }
            />

            <label htmlFor="comment">Комментарий:</label>
            <Field as={TextArea} name="comment" />

            <div className={styles.buttonContainer}>
              <Tooltip
                title={
                  !(
                    values.tower &&
                    values.floor &&
                    values.room &&
                    values.date &&
                    values.timeRange
                  )
                    ? "Заполните все поля"
                    : ""
                }
                placement="top"
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !(
                      values.tower &&
                      values.floor &&
                      values.room &&
                      values.date &&
                      values.timeRange
                    )
                  }
                >
                  Отправить
                </Button>
              </Tooltip>
              <Button
                type="default"
                onClick={() => {
                  handleReset(resetForm);
                }}
              >
                Очистить
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookingForm;
