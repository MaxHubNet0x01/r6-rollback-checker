require "json"

module Jekyll
  class GenQuestMdFilesTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      params = text.strip.split ','
      @folder_path = params[0]
      @output_path = params[1]
      @template_path = params[2]
      @logger = Logger.new(STDOUT)
    end

    def sputs(string, method_name = nil)
      name = self.class.name
      
      method = "Unknown Method"
      if method_name
        method = method_name.to_s
      end

      output = "[[#{name}]] > [[#{method}]] : #{string}"
      @logger.info "\n=================================\n" + output + "\n=================================\n"
    end

    def render(context)
      site_source = context.registers[:site].source
      full_path = File.join(site_source, @folder_path)
      output_full_path = File.join(site_source, @output_path)
      template_full_path = File.join(site_source, @template_path)

      template = File.read(template_full_path)

      build_files(full_path, site_source, output_full_path, template)
    end

    def gen_category_from_path(full_entry_path, site_source)
      full_entry_path = full_entry_path.sub("#{site_source}/", "").sub("#{@folder_path}/", "").split("/")
      full_entry_path.delete_at -1

      full_entry_path
    end

    def build_files(path, site_source, output, template)
      {
        name: File.basename(path),
        type: "directory",
        children: Dir.children(path).map do |entry|
          full_entry_path = File.join(path, entry)
          if File.directory?(full_entry_path)
            build_files(full_entry_path, site_source, output, template)
          else
            root_filename = entry.sub(".json", "")
            {
              name: root_filename,
              type: "file",
              path: full_entry_path.sub("#{site_source}/", ""),
              category: gen_category_from_path(full_entry_path, site_source)
            }

            quest_json = JSON.parse(File.read(full_entry_path))

            gen_temp = template.sub("__QUEST_NAME__", "'#{quest_json["name"]}'").sub("__QUEST_DESCRIPTION__", "'#{quest_json["description"]}'")
              .sub("__QUEST_ID__", root_filename)

            File.write(output + "/#{root_filename}.md", gen_temp)

            sputs "Created Quest File #{root_filename}.md at: #{output}"
          end
        end
      }
    end
  end
end

Liquid::Template.register_tag('gen_quests_md_files', Jekyll::GenQuestMdFilesTag)