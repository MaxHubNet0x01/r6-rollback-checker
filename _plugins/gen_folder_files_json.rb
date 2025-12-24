require "json"

module Jekyll
  class GenFolderFilesJsonTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      params = text.strip.split(",")
      @folder_path = params[0]
      
      if params[1]
        @extra_field = params[1]
      else
        @extra_field = nil
      end

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
            if @extra_field
              fileJson = JSON.parse(File.read(full_entry_path))
              @extra_field = fileJson[@extra_field]
            end

            {
              name: entry.sub(".json", ""),
              type: "file",
              path: full_entry_path.sub("#{site_source}/", ""),
              category: gen_category_from_path(full_entry_path, site_source),
              extra_field: @extra_field
            }
          end
        end
      }
    end
  end
end

Liquid::Template.register_tag('gen_folder_files_json', Jekyll::GenFolderFilesJsonTag)