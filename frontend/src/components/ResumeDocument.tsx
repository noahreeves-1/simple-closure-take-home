import React from "react";
import { Page, Text, View, Document, Image, Link } from "@react-pdf/renderer";
import { ScrapeData, WorkExperience, Education } from "../types";
import { resumeStyles as styles } from "../styles/resumeStyles";

interface ResumeDocumentProps {
  data: ScrapeData;
  linkedInUrl: string;
}

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
          {workExperience.map((exp: WorkExperience) => (
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
          {education.map((edu: Education) => (
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
        Generated Resume Footer
      </Text>

      {/* //* Page numbers not working for some reason. Followed documentation  */}
      {/* <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />

      <View
        render={({ pageNumber }) =>
          pageNumber % 2 === 0 && (
            <View style={{ backgroundColor: "red" }}>
              <Text>I'm only visible in odd pages!</Text>
            </View>
          )
        }
      /> */}
    </Page>
  </Document>
);
