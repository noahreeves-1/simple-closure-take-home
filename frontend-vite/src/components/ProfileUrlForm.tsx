import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument } from "./ResumeDocument";
import { useScrapeProfileMutation } from "@/hooks/useScrapeProfile";
import { LINKEDIN_PROFILE_REGEX } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Download } from "lucide-react";

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

const resumeFileName = (name: string) =>
  `${name.replace(/\s+/g, "_")}_Resume.pdf`;

export const ProfileUrlForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      linkedInUrl: "",
    },
  });

  const {
    mutateAsync,
    data: profileData,
    error: mutationError,
    isPending,
  } = useScrapeProfileMutation();

  const onFormSubmit: SubmitHandler<IFormInput> = async (data) => {
    await mutateAsync(data.linkedInUrl);
  };

  const fileName = resumeFileName(profileData?.name || "Resume");

  return (
    <div className="mt-8 sm:mx-auto w-full">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="linkedin-url"
            className="block text-sm font-medium text-gray-700"
          >
            LinkedIn Profile URL
          </Label>
          <Controller
            name="linkedInUrl"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="url"
                id="linkedin-url"
                placeholder="https://www.linkedin.com/in/your-profile"
                aria-invalid={errors.linkedInUrl ? "true" : "false"}
                className="block w-full rounded-md"
              />
            )}
          />
          {errors.linkedInUrl && (
            <p className="text-sm text-red-500" role="alert">
              {errors.linkedInUrl.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isPending || !isValid}
          className="w-full flex justify-center py-2 px-4"
        >
          {isPending ? "Generating..." : "Generate Resume"}
        </Button>
      </form>

      {isPending && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">
            Fetching profile data, please wait...
          </p>
        </div>
      )}

      {mutationError && !isPending && (
        <div className="mt-8 text-center">
          <p className="text-sm text-red-500">
            Error: {mutationError?.message}
          </p>
        </div>
      )}

      {profileData && (
        <div className="mt-8 text-center">
          <PDFDownloadLink
            document={<ResumeDocument data={profileData} />}
            fileName={fileName}
          >
            {({ loading }) => (
              <Button variant="green" size="lg" disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                {fileName}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};
