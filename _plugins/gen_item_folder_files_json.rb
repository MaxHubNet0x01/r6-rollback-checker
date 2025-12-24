require "json"

module Jekyll
  class GenItemFolderFilesJsonTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @folder_path = text.strip
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
      full_path   = File.join(site_source, @folder_path)

      tree = build_tree(full_path, site_source)
      JSON.generate(tree)
    end

    def gen_category_from_path(full_entry_path, site_source)
      full_entry_path = full_entry_path.sub("#{site_source}/", "").sub("#{@folder_path}/", "").split("/")
      full_entry_path.delete_at -1

      full_entry_path
    end

    def build_tree(path, site_source)
      {
        name: File.basename(path),
        type: "directory",
        children: Dir.children(path).map do |entry|
          full_entry_path = File.join(path, entry)
          if File.directory?(full_entry_path)
            build_tree(full_entry_path, site_source)
          else
            fileJson = JSON.parse(File.read(full_entry_path))
            item_name = nil

            skip = false

            if fileJson["type"] == "equipment"
              if fileJson["quality"] != 0
                skip = true
              end
            end

            if fileJson["item_name"]
              item_name = fileJson["item_name"].gsub("\n"," ");
            elsif fileJson["name"]
              item_name = fileJson["name"].gsub("\n"," ");
            end

            {
              name: entry.sub(".json", ""),
              type: skip ? "upgrade" : "file",
              path: full_entry_path.sub("#{site_source}/", ""),
              category: skip ? nil : gen_category_from_path(full_entry_path, site_source),
              item_name: item_name,
              icon_id: fileJson["icon"] ? fileJson["icon"]["icon_id"] : nil,
              craft_recipe: fileJson["craft_recipe"],
              gradeup_recipe: fileJson["gradeup_recipe"],
              item_type: fileJson["type"],
              item_id: fileJson["item_id"],
              item_quality: fileJson["quality"]
            }
          end
        end
      }
    end
  end
end

Liquid::Template.register_tag('gen_item_folder_files_json', Jekyll::GenItemFolderFilesJsonTag)