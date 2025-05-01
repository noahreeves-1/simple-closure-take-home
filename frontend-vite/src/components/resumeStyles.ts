import { StyleSheet } from "@react-pdf/renderer";

export const resumeStyles = StyleSheet.create({
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
