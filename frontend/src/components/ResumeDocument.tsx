import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { ScrapeData, WorkExperience, Education } from "../types";

interface ResumeDocumentProps {
  data: ScrapeData;
  linkedInUrl: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  nameTitleBlock: {
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  section: {
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingBottom: 3,
    textTransform: "uppercase",
  },
  listItem: {
    marginBottom: 12,
  },
  titleDateLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  companyLocationLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  company: {
    fontSize: 10.5,
  },
  dateRange: {
    fontSize: 9.5,
    color: "#555555",
  },
  location: {
    fontSize: 9.5,
    fontStyle: "italic",
    color: "#555555",
  },
  description: {
    fontSize: 10,
    color: "#333333",
  },
  educationItem: {
    marginBottom: 10,
  },
  schoolDateLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  school: {
    fontSize: 11,
    fontWeight: "bold",
  },
  degree: {
    fontSize: 10.5,
    marginBottom: 1,
  },
  fixedHeader: {
    position: "absolute",
    top: 25,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingBottom: 5,
    fontSize: 9,
    color: "#555555",
  },
  headerLink: {
    color: "#0077B5",
    textDecoration: "none",
  },
  fixedFooter: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "right",
    fontSize: 9,
    color: "grey",
    fontFamily: "Helvetica",
  },
});

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  data: { name, photoUrl, workExperience, education },
  linkedInUrl,
}) => (
  <Document title={`${name || "Resume"}`}>
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.fixedHeader} fixed>
        <Text>{name || "Name Not Found"}</Text>
        <Link style={styles.headerLink} src={linkedInUrl}>
          {linkedInUrl}
        </Link>
      </View>

      <View style={styles.headerSection}>
        {photoUrl && <Image style={styles.profileImage} src={photoUrl} />}
        <View style={styles.nameTitleBlock}>
          <Text style={styles.header}>{name || "Name Not Found"}</Text>
        </View>
      </View>

      {workExperience && workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Professional Experience</Text>
          {workExperience.map((exp: WorkExperience, index: number) => (
            <View
              key={`${exp.company} - ${exp.dateRange}`}
              style={styles.listItem}
            >
              <View style={styles.titleDateLine}>
                {exp.title && <Text style={styles.jobTitle}>{exp.title}</Text>}
                {exp.dateRange && (
                  <Text style={styles.dateRange}>{exp.dateRange}</Text>
                )}
              </View>
              <View style={styles.companyLocationLine}>
                {exp.company && (
                  <Text style={styles.company}>{exp.company}</Text>
                )}
                {exp.location && (
                  <Text style={styles.location}>{exp.location}</Text>
                )}
              </View>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {education && education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Education</Text>
          {education.map((edu: Education, index: number) => (
            <View
              key={`${edu.school} - ${edu.dateRange}`}
              style={styles.educationItem}
            >
              <View style={styles.schoolDateLine}>
                {edu.school && <Text style={styles.school}>{edu.school}</Text>}
                {edu.dateRange && (
                  <Text style={styles.dateRange}>{edu.dateRange}</Text>
                )}
              </View>
              {edu.degree && <Text style={styles.degree}>{edu.degree}</Text>}
              {edu.description && (
                <Text style={styles.description}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <Text style={styles.fixedFooter} fixed>
        Generated Resume
      </Text>
    </Page>
  </Document>
);
