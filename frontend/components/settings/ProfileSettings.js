import React from 'react';
import useSettingsForm from './useSettingsForm';
import styles from './styles.module.css';

const ProfileSettings = () => {
  const { formData, handleChange, handleSubmit } = useSettingsForm();

  return (
    <div className={styles.settingsContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>Username</label>
          <input type="text" id="username" name="username" className={styles.formInput} value={formData.username} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input type="email" id="email" name="email" className={styles.formInput} value={formData.email} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>Password</label>
          <input type="password" id="password" name="password" className={styles.formInput} value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit" className={styles.submitButton}>Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
