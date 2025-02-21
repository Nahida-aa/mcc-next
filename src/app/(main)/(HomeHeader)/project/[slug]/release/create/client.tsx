"use client";
import { ArrowLeftRight, ChevronDown, FileBox, FileIcon, Plus, Trash2, UploadIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { useSelectedFile } from "../_comp/selectedFile-context";
import { formatBytes } from "~/lib/utils/file";
import { Chip, Button as UIButton } from "@heroui/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import JSZip from "jszip";
import { MultiCombobox, SelectDemo } from "~/components/aa/Select";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gameReleaseVersions from '~/constants/gameReleaseVersions.json'
import { LoaderIcon } from "~/components/icons";
import { LoadingIcon } from "~/components/common/submit-button";

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'jar') {
    return <FileBox size={20} />;
  }
  return <FileIcon size={20} />;
};

const versionType = (version_number: string) => {
  if (version_number.includes("alpha")) {
    return "alpha";
  } else if (
    version_number.includes("beta") ||
    version_number.match(/[^A-z](rc)[^A-z]/) || // includes `rc`
    version_number.match(/[^A-z](pre)[^A-z]/) // includes `pre`
  ) {
    return "beta";
  } else {
    return "release";
  }
}

const analyzeJarFile = async (file: File) => {
  const zip = await JSZip.loadAsync(file);
  const manifest = await zip.file("META-INF/MANIFEST.MF")?.async("string");
  return {
    manifest,
  };
};

type InferReleaseInfoParams = {
  file: File;
  project: any;
  gameVersions: string[];
}
const inferReleaseInfo = async ({file, project, gameVersions}:InferReleaseInfoParams) => {}

const releaseTypeOptions = [
  { value: "release", label: "Release" },
  { value: "beta", label: "Beta" },
  { value: "alpha", label: "Alpha" }
]

const loaders = [
  { value: "bukkit", label: "Bukkit" },
  { value: "data_pack", label: "Data Pack" },
  { value: "fabric", label: "Fabric" },
  { value: "forge", label: "Forge" },
  { value: "neoforge", label: "NeoForge"},
  { value: "quilt", label: "Quilt" },
  { value: "liteloader", label: "LiteLoader" },
  { value: "optifine", label: "OptiFine" },
]

const gameVersionOptions = gameReleaseVersions.map((version) => ({ value: version.version, label: version.version }));

const formSchema = z.object({
  name: z.string().min(2, {
    message: "version title must be at least 2 characters."
  }),
  type: z.enum(["release", "beta", "alpha"], {message: "only release, beta, alpha are allowed."}),
  version_number: z.string().min(1, {
    message: "Your release must have a version number."
  }),
  loaders: z.array(z.string().min(1), {
    message: "Your release must have the supported mod loaders selected. "
  }),
  game_versions: z.array(z.string().min(1), {
    message: "Your release must have the supported Minecraft versions selected. "
  }),
})

export const MainComp = ({
  slug
}: {
  slug: string;
}) => {
  const router = useRouter();
  const { selectedFile, setSelectedFile } = useSelectedFile();
  const [releaseFiles, setReleaseFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      version_number: "",
      type: "release",
      loaders: [],
      game_versions: [],
    },
  })
  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 模拟延时
    console.log(`onSubmit: `, values);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const onInputSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`onInputSelect`);
    const files = e.target.files;
    if (files) {
      setReleaseFiles([...releaseFiles, ...Array.from(files)]);
    }
  }
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    console.log(`handleDrop`);
    const files = e.dataTransfer.files;
    if (files) {
      setReleaseFiles([...releaseFiles, ...Array.from(files)]);
    }
  };

  const onRemoveFile = (index: number) => {
    console.log(`onRemoveFile: `, index);
    const newFiles = [...releaseFiles];
    newFiles.splice(index, 1);
    setReleaseFiles(newFiles);
  }

  useEffect(() => {
    console.log(`MainComp: useEffect: 0`);
    if (selectedFile) {
      console.log(`MainComp: selectedFile: `, selectedFile);
      setReleaseFiles([...releaseFiles, selectedFile]);
    }
  }, []);

  return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    {/* ReleaseTitle and submit button */}
    <Card className="p-6 space-y-4">
      <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem>
        {/* <FormLabel>Username</FormLabel> */}
        <FormControl>
        <Input placeholder="Enter a release title" className="bg-secondary" {...field} />
        </FormControl>
        {Object.keys(form.formState.errors).length > 0 && (
        <ul className="text-red-400 text-sm list-disc px-4">
          {Object.entries(form.formState.errors).map(([key, error]) => (<li key={key}>{error.message}</li>))}
        </ul>
        )}
      </FormItem>
      )}/>
      <div className="space-x-4">
        <UIButton startContent={isLoading ? <LoadingIcon size={20} />:<Plus size={20} />} type="submit" className="bg-primary text-base font-semibold">Create</UIButton>
        <UIButton startContent={<X size={20} />} className="text-base font-semibold" type="button" onPress={()=>router.push(`/project/${slug}/release`)}>Cancel</UIButton>
      </div>
    </Card>
    {/* ReleaseChangLog (description) */}
    <section className="flex flex-col lg:flex-row w-full gap-4">
      <Card className="p-6 space-y-4 flex-1">
        <div>ReleaseChangLog 占位</div>
      </Card>
      {/* Release Metadata */}
      <Card className="p-6 space-y-4 lg:w-80">
        <h3 className="text-xl font-bold mb-2">Metadata</h3>
        <FormField control={form.control} name="type" render={({ field }) => (
        <FormItem>
          <FormLabel>Release type</FormLabel>
          <FormControl><SelectDemo value={field.value} setValue={field.onChange} options={releaseTypeOptions} /></FormControl>
          <FormMessage />
        </FormItem>)}/>
        <FormField control={form.control} name="version_number" render={({ field }) => (
        <FormItem>
          <FormLabel>Version number</FormLabel>
          <FormControl><Input  {...field} className="bg-secondary" placeholder="e.g: 1.0.0" /></FormControl>
        </FormItem>)}/>
        <FormField control={form.control} name="loaders" render={({ field }) => (
        <FormItem>
          <FormLabel>Loaders</FormLabel>
          <FormControl>
          <MultiCombobox {...field} selectedValues={field.value} setSelectedValues={field.onChange} options={loaders} optionName={"loaders"}  />
          </FormControl>
          <FormMessage />
        </FormItem>)}/>
        <FormField control={form.control} name="game_versions" render={({ field }) => (
        <FormItem>
          <FormLabel>Game versions</FormLabel>
          <FormControl>
          <MultiCombobox {...field} selectedValues={field.value} setSelectedValues={field.onChange} options={gameVersionOptions} optionName={"Game versions"}  />
          </FormControl>
          <FormMessage />
        </FormItem>)}/>
        {/* <div className="flex flex-col space-y-1.5">
          <Label htmlFor="Game versions"></Label>
          <MultiCombobox selectedValues={} setSelectedValues={setSelectedLoaders} options={gameVersionOptions} optionName={"Game versions"} />
        </div> */}
      </Card>
    </section>
    <section className="flex flex-col lg:flex-row  w-full gap-4">
      <Card className="p-6 flex-1">
        <h3 className="text-xl font-bold mb-2">Files</h3>
        {/* files */}
        <ul>
          {releaseFiles.map((file, index) => (
            <li key={index} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg mb-3">
              {getFileIcon(file.name)}
              <span className="flex gap-2"><strong>{file.name}</strong><span>{`(${formatBytes(file.size)})`}</span>
              </span>
                <span>{file.type}</span>
              <UIButton color="danger" className="flex w-fit px-4 py-2 gap-2 rounded-md cursor-pointer leading-5 ml-auto " onPress={() => onRemoveFile(index)}>
                <Trash2 size={20} />Remove
              </UIButton>
            </li>
          ))}
        </ul>
        {/* Drag */}
        <div>
          <h4 className="font-bold">Upload files</h4>
          <span>Used for files such as sources or Java docs.</span>
          <label onDrop={handleDrop} onDragOver={(e)=>{
            e.preventDefault();
          }} className="flex bg-secondary px-8 py-6 mt-2 gap-2 items-center justify-center rounded-3xl cursor-pointer border-4 border-dashed border-current" aria-label="Upload additional file" >
            <UploadIcon size={20} />Drag and drop to upload or click to select
            <input type="file" multiple accept=".jar,.zip,.litemod,application/java-archive,application/x-java-archive,application/zip" className="hidden" onChange={onInputSelect}  />
          </label>
        </div>
      </Card>
      {/* Release Dependencies */}
      <Card className="p-6 space-y-4 lg:w-80">
        <div>Release Dependencies 占位</div>
      </Card>
    </section>
  </form></Form>
}

