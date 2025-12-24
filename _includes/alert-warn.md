<div class="bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-6 rounded-lg my-5 {{ include.extra_class }}" role="alert">
  <div class="mb-3 flex items-center fill-yellow-800">
    {% include info-icon.svg class="dark:fill-yellow-300" %}
    <strong class="font-bold text-sm mr-3">{{ include.heading }}</strong>
  </div>

  <div class="text-sm">{{ include.content }}</div>
</div>