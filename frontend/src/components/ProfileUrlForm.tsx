import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument } from "./ResumeDocument";
import { useScrapeProfileMutation } from "../hooks/useScrapeProfile";
import { LINKEDIN_PROFILE_REGEX, FILE_NAMES } from "../constants/config";

import * as Label from "@radix-ui/react-label";

const FormSchema = z.object({
  linkedInUrl: z
    .string()
    .min(1, "LinkedIn URL is required")
    .regex(
      LINKEDIN_PROFILE_REGEX,
      "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/your-profile-name)"
    ),
});

type IFormInput = z.infer<typeof FormSchema>;

export const ProfileUrlForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      linkedInUrl: "",
    },
  });

  const {
    mutateAsync,
    data: scrapeData,
    error: mutationError,
    isPending,
    isSuccess,
    isError,
  } = useScrapeProfileMutation();

  const onFormSubmit: SubmitHandler<IFormInput> = async (data) => {
    // console.log("Form submit, triggering mutation with URL:", data.linkedInUrl);
    await mutateAsync(data.linkedInUrl);
  };

  const linkedInUrl = watch("linkedInUrl");

  // const displayFetchError = mutationError?.message || null;

  return (
    <div className="profile-url-form-container">
      <form onSubmit={handleSubmit(onFormSubmit)} className="radix-form">
        <Label.Root htmlFor="linkedin-url" className="radix-label">
          LinkedIn Profile URL:
        </Label.Root>
        <Controller
          name="linkedInUrl"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="url"
              id="linkedin-url"
              className="radix-input"
              placeholder="https://www.linkedin.com/in/your-profile"
              aria-invalid={errors.linkedInUrl ? "true" : "false"}
            />
          )}
        />

        {errors.linkedInUrl && (
          <p role="alert" className="error-message field-error radix-error">
            {errors.linkedInUrl.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !isValid}
          className="radix-button"
        >
          {isPending ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {isPending && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching profile data, please wait...</p>
        </div>
      )}

      {mutationError && !isPending && (
        <p className="error-message">Error: {mutationError?.message}</p>
      )}

      {isSuccess && scrapeData && linkedInUrl && !isPending && (
        <div className="results-container">
          <PDFDownloadLink
            document={
              <ResumeDocument data={scrapeData} linkedInUrl={linkedInUrl} />
            }
            fileName={FILE_NAMES.RESUME(scrapeData.name || "Resume")}
            className="pdf-download-link"
          >
            Download Resume PDF
          </PDFDownloadLink>
        </div>
      )}
      {isError && (
        <p className="error-message">Error: {mutationError?.message}</p>
      )}
    </div>
  );
};
