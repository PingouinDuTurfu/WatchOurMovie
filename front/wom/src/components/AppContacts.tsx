import { Email, LocationOn, GitHub } from "@mui/icons-material";
import styles from "../css/AppContacts.module.css";
import { Typography } from "@mui/material";

export default function AppContacts() {
  return (
    <div className={styles.container}>
      <Typography variant="h2">Contactez-nous</Typography>
      <div className={styles.contacts}>
        <div className={styles.contact}>
          <Email className={styles.icon} />
          <a href="mailto:lantaaxel@cy-tech.fr">lantaaxel@cy-tech.fr</a>
        </div>
        <div className={styles.contact}>
          <Email className={styles.icon} />
          <a href="mailto:leangameil@cy-tech.fr">leangameil@cy-tech.fr</a>
        </div>

        <div className={styles.contact}>
          <Email className={styles.icon} />
          <a href="mailto:ollivierre@cy-tech.fr">ollivierre@cy-tech.fr</a>
        </div>

        <div className={styles.contact}>
          <Email className={styles.icon} />
          <a href="mailto:sallmariem@cy-tech.fr">sallmariem@cy-tech.fr</a>
        </div>

        <div className={styles.contact}>
          <GitHub className={styles.icon} />
          <a href="https://github.com/PingouinDuTurfu/WatchOurMovie" target="/">GitHub (Need rights)</a>
        </div>
        <div className={styles.contact}>
          <LocationOn className={styles.icon} />
          <span>Cy Tech, 2 Boulevard Lucien Favre, 64000 Pau</span>
        </div>
      </div>
    </div>
  );
}
