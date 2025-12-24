<div class="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-100 p-6 rounded-lg my-5" role="alert">
  <div class="mb-3 flex items-center fill-blue-800">
    {% include info-icon.svg class="dark:fill-blue-300" %}
    <strong class="font-bold text-sm mr-3">{{ include.heading }}</strong>
  </div>

  <div class="text-sm">{{ include.content }}</div>
</div>