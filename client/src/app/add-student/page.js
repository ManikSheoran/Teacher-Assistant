import addFormStyles from './styles.module.css';

const StudentForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className={addFormStyles.formContainer}>
      <p>Student Record</p>
      <form >
        <div className={addFormStyles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className={addFormStyles.formGroup}>
          <label htmlFor="studentId">Student ID:</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            placeholder="Enter your student ID"
            required
          />
        </div>
        <div className={addFormStyles.formGroup}>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
