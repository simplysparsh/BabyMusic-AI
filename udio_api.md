# Song API Task Creation Examples

This document provides examples and descriptions for tasks supported by the Song API. Below are the available modes and configurations for `music-u`.

## Music-u (Udio API)

Currently, the `music-u` model supports only the `generate_music` task. Below are the task examples for different use cases:

### Request Body Example of Udio Simple Prompt
This mode generates music based on a textual description prompt. It is similar to Suno's description mode.

```json
{
    "model": "music-u",
    "task_type": "generate_music",
    "input": {
        "gpt_description_prompt": "night breeze, piano",
        "negative_tags": "",
        "lyrics_type": "generate",
        "seed": -1
    },
    "config": {
        "service_mode": "public",
        "webhook_config": {
            "endpoint": "",
            "secret": ""
        }
    }
}
```

### Request Body Example of Udio Instrumental
This mode generates instrumental music. 
```json
{
    "model": "music-u",
    "task_type": "generate_music",
    "input": {
        "gpt_description_prompt": "night breeze",
        "negative_tags": "",
        "lyrics_type": "instrumental",
        "seed": -1

    },
    "config": {
        "service_mode": "public",
        "webhook_config": {
            "endpoint": "",
            "secret": ""
        }
    }
}
```

### Request Body Example of Udio Full Lyrics
This mode generates music using user-provided lyrics.

```json
{
    "model": "music-u",
    "task_type": "generate_music",
    "input": {
        "prompt": "[Verse]\nIn the gentle evening air,\nWhispers dance without a care.\nStars ignite our dreams above,\nWrapped in warmth, we find our love.\n[Chorus]\n",
        "negative_tags": "",
        "lyrics_type": "user",
        "seed": -1
    },
    "config": {
        "service_mode": "public",
        "webhook_config": {
            "endpoint": "",
            "secret": ""
        }
    }
}
```

---
# [Udio] Song Extend

## Udio Song Extend
Udio extend uses `udio32` by default. That means you can only extend 32 seconds on every extend call

## Udio Song Extend Example
```
{
    "model": "music-u",
    "task_type": "generate_music",
    "input": {
        "gpt_description_prompt": "winter snow, Folk music",
        "lyrics": "",
        "negative_tags": "",
        "lyrics_type": "generate",
        "seed": -1,
        "continue_song_id": "1307fd94-adbc-4787-b8e3-2e89f84ef22b",
        "continue_at": 0

    },
    "config": {
        "service_mode": "public",
        "webhook_config": {
            "endpoint": "",
            "secret": ""
        }
    }
}
```

# Get Task

> **Note:** This endpoint is for polling task status. BabyMusic AI currently relies exclusively on webhooks for task completion notifications and **does not use this `Get Task` endpoint.** The OpenAPI definition below is provided for general API reference only. Refer to the "Webhook Payload Example" section for the structure received upon task completion via webhook.

> This endpoint from [PiAPI's Suno API](https://piapi.ai/suno-api) retrieves the output of a Song generation task.

## OpenAPI

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/task/{task_id}:
    get:
      summary: Get Task
      deprecated: false
      description: >-
        This endpoint from [PiAPI's Suno API](https://piapi.ai/suno-api)
        retrieves the output of a Song generation task.
      operationId: suno-api/get-task
      tags:
        - Endpoints/Song(Udio)
      parameters:
        - name: task_id
          in: path
          description: ''
          required: true
          schema:
            type: string
        - name: x-api-key
          in: header
          description: Your API Key used for request authorization
          required: true
          example: ''
          schema:
            type: string
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                  data:
                    type: object
                    properties:
                      task_id:
                        type: string
                      model:
                        type: string
                      task_type:
                        type: string
                      status:
                        type: string
                        enum:
                          - Completed
                          - Processing
                          - Pending
                          - Failed
                          - Staged
                        x-apidog-enum:
                          - value: Completed
                            name: ''
                            description: ''
                          - value: Processing
                            name: ''
                            description: >-
                              Means that your jobs is currently being processed.
                              Number of "processing" jobs counts as part of the
                              "concurrent jobs"
                          - value: Pending
                            name: ''
                            description: >-
                              Means that we recognizes the jobs you sent should
                              be processed by MJ/Luma/Suno/Kling/etc but right
                              now none of the  account is available to receive
                              further jobs. During peak loads there can be
                              longer wait time to get your jobs from "pending"
                              to "processing". If reducing waiting time is your
                              primary concern, then a combination of
                              Pay-as-you-go and Host-your-own-account option
                              might suit you better.Number of "pending" jobs
                              counts as part of the "concurrent jobs"
                          - value: Failed
                            name: ''
                            description: Task failed. Check the error message for detail.
                          - value: Staged
                            name: ''
                            description: >-
                              A stage only in Midjourney task . Means that you
                              have exceeded the number of your "concurrent jobs"
                              limit and your jobs are being queuedNumber of
                              "staged" jobs does not count as part of the
                              "concurrent jobs". Also, please note the maximum
                              number of jobs in the "staged" queue is 50. So if
                              your operational needs exceed the 50 jobs limit,
                              then please create your own queuing system logic. 
                        description: >-
                          Hover on the "Completed" option and you coult see the
                          explaintion of all status:
                          completed/processing/pending/failed/staged
                      input:
                        type: object
                        properties: {}
                        x-apidog-orders: []
                        x-apidog-ignore-properties: []
                      output:
                        type: object
                        properties: {}
                        x-apidog-orders: []
                        x-apidog-ignore-properties: []
                      meta:
                        type: object
                        properties:
                          created_at:
                            type: string
                            description: >-
                              The time when the task was submitted to us (staged
                              and/or pending)
                          started_at:
                            type: string
                            description: >-
                              The time when the task started processing. the
                              time from created_at to time of started_at is time
                              the job spent in the "staged" stage and/or
                              the"pending" stage if there were any.
                          ended_at:
                            type: string
                            description: The time when the task finished processing.
                          usage:
                            type: object
                            properties:
                              type:
                                type: string
                              frozen:
                                type: number
                              consume:
                                type: number
                            x-apidog-orders:
                              - type
                              - frozen
                              - consume
                            required:
                              - type
                              - frozen
                              - consume
                            x-apidog-ignore-properties: []
                          is_using_private_pool:
                            type: boolean
                        x-apidog-orders:
                          - created_at
                          - started_at
                          - ended_at
                          - usage
                          - is_using_private_pool
                        required:
                          - usage
                          - is_using_private_pool
                        x-apidog-ignore-properties: []
                      detail:
                        type: 'null'
                      logs:
                        type: array
                        items:
                          type: object
                          properties: {}
                          x-apidog-orders: []
                          x-apidog-ignore-properties: []
                      error:
                        type: object
                        properties:
                          code:
                            type: integer
                          message:
                            type: string
                        x-apidog-orders:
                          - code
                          - message
                        x-apidog-ignore-properties: []
                    x-apidog-orders:
                      - task_id
                      - model
                      - task_type
                      - status
                      - input
                      - output
                      - meta
                      - detail
                      - logs
                      - error
                    required:
                      - task_id
                      - model
                      - task_type
                      - status
                      - input
                      - output
                      - meta
                      - detail
                      - logs
                      - error
                    x-apidog-ignore-properties: []
                  message:
                    type: string
                    description: >-
                      If you get non-null error message, here are some steps you
                      chould follow:

                      - Check our [common error
                      message](https://climbing-adapter-afb.notion.site/Common-Error-Messages-6d108f5a8f644238b05ca50d47bbb0f4)

                      - Retry for several times

                      - If you have retried for more than 3 times and still not
                      work, file a ticket on Discord and our support will be
                      with you soon.
                x-apidog-orders:
                  - 01J8H2AHAPJQ7K2622H850XR31
                required:
                  - code
                  - data
                  - message
                x-apidog-refs:
                  01J8H2AHAPJQ7K2622H850XR31:
                    $ref: '#/components/schemas/Unified-Task-Response'
                x-apidog-ignore-properties:
                  - code
                  - data
                  - message
              example:
                code: 200
                data:
                  task_id: 7088bf9d-6edb-4fab-b1fd-83afc64dde91
                  model: suno
                  task_type: generate_music
                  status: completed
                  config:
                    service_mode: public
                    webhook_config:
                      endpoint: ''
                      secret: ''
                  input: {}
                  output:
                    clips:
                      7d7231fa-5015-4f71-8d0b-fd446f1dd446: {}
                      a43c955a-3474-47f3-a550-57bf7c395c48:
                        id: ''
                        video_url: https://xxx.mp4
                        audio_url: https://xxx.mp3
                        image_url: https://xxx.jpeg
                        image_large_url: https://xxx.jpeg
                        is_video_pending: false
                        major_model_version: v3
                        model_name: chirp-v3
                        metadata:
                          tags: ''
                          prompt: ''
                          gpt_description_prompt: ''
                          audio_prompt_id: ''
                          history: null
                          concat_history: null
                          type: gen
                          duration: 102
                          refund_credits: false
                          stream: true
                          error_type: ''
                          error_message: ''
                        is_liked: false
                        user_id: ''
                        display_name: ''
                        handle: ''
                        is_handle_updated: false
                        is_trashed: false
                        reaction: null
                        created_at: ''
                        status: complete
                        title: ''
                        play_count: 0
                        upvote_count: 0
                        is_public: false
                  meta: {}
                  detail: null
                  logs: []
                  error:
                    code: 0
                    raw_message: ''
                    message: ''
                    detail: null
                message: success
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: Endpoints/Song(Udio)
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/675356/apis/api-10275887-run
components:
  schemas:
    Unified-Task-Response:
      type: object
      properties:
        code:
          type: integer
        data:
          type: object
          properties:
            task_id:
              type: string
            model:
              type: string
            task_type:
              type: string
            status:
              type: string
              enum:
                - Completed
                - Processing
                - Pending
                - Failed
                - Staged
              x-apidog-enum:
                - value: Completed
                  name: ''
                  description: ''
                - value: Processing
                  name: ''
                  description: >-
                    Means that your jobs is currently being processed. Number of
                    "processing" jobs counts as part of the "concurrent jobs"
                - value: Pending
                  name: ''
                  description: >-
                    Means that we recognizes the jobs you sent should be
                    processed by MJ/Luma/Suno/Kling/etc but right now none of
                    the  account is available to receive further jobs. During
                    peak loads there can be longer wait time to get your jobs
                    from "pending" to "processing". If reducing waiting time is
                    your primary concern, then a combination of Pay-as-you-go
                    and Host-your-own-account option might suit you
                    better.Number of "pending" jobs counts as part of the
                    "concurrent jobs"
                - value: Failed
                  name: ''
                  description: Task failed. Check the error message for detail.
                - value: Staged
                  name: ''
                  description: >-
                    A stage only in Midjourney task . Means that you have
                    exceeded the number of your "concurrent jobs" limit and your
                    jobs are being queuedNumber of "staged" jobs does not count
                    as part of the "concurrent jobs". Also, please note the
                    maximum number of jobs in the "staged" queue is 50. So if
                    your operational needs exceed the 50 jobs limit, then please
                    create your own queuing system logic. 
              description: >-
                Hover on the "Completed" option and you coult see the
                explaintion of all status:
                completed/processing/pending/failed/staged
            input:
              type: object
              properties: {}
              x-apidog-orders: []
              x-apidog-ignore-properties: []
            output:
              type: object
              properties: {}
              x-apidog-orders: []
              x-apidog-ignore-properties: []
            meta:
              type: object
              properties:
                created_at:
                  type: string
                  description: >-
                    The time when the task was submitted to us (staged and/or
                    pending)
                started_at:
                  type: string
                  description: >-
                    The time when the task started processing. the time from
                    created_at to time of started_at is time the job spent in
                    the "staged" stage and/or the"pending" stage if there were
                    any.
                ended_at:
                  type: string
                  description: The time when the task finished processing.
                usage:
                  type: object
                  properties:
                    type:
                      type: string
                    frozen:
                      type: number
                    consume:
                      type: number
                  x-apidog-orders:
                    - type
                    - frozen
                    - consume
                  required:
                    - type
                    - frozen
                    - consume
                  x-apidog-ignore-properties: []
                is_using_private_pool:
                  type: boolean
              x-apidog-orders:
                - created_at
                - started_at
                - ended_at
                - usage
                - is_using_private_pool
              required:
                - usage
                - is_using_private_pool
              x-apidog-ignore-properties: []
            detail:
              type: 'null'
            logs:
              type: array
              items:
                type: object
                properties: {}
                x-apidog-orders: []
                x-apidog-ignore-properties: []
            error:
              type: object
              properties:
                code:
                  type: integer
                message:
                  type: string
              x-apidog-orders:
                - code
                - message
              x-apidog-ignore-properties: []
          x-apidog-orders:
            - task_id
            - model
            - task_type
            - status
            - input
            - output
            - meta
            - detail
            - logs
            - error
          required:
            - task_id
            - model
            - task_type
            - status
            - input
            - output
            - meta
            - detail
            - logs
            - error
          x-apidog-ignore-properties: []
        message:
          type: string
          description: >-
            If you get non-null error message, here are some steps you chould
            follow:

            - Check our [common error
            message](https://climbing-adapter-afb.notion.site/Common-Error-Messages-6d108f5a8f644238b05ca50d47bbb0f4)

            - Retry for several times

            - If you have retried for more than 3 times and still not work, file
            a ticket on Discord and our support will be with you soon.
      x-examples:
        Example 1:
          code: 200
          data:
            task_id: 49638cd2-4689-4f33-9336-164a8f6b1111
            model: Qubico/flux1-dev
            task_type: txt2img
            status: pending
            input:
              prompt: a bear
            output: null
            meta:
              account_id: 0
              account_name: Qubico_test_user
              created_at: '2024-08-16T16:13:21.194049Z'
              started_at: ''
              completed_at: ''
            detail: null
            logs: []
            error:
              code: 0
              message: ''
          message: success
      x-apidog-orders:
        - code
        - data
        - message
      required:
        - code
        - data
        - message
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
  securitySchemes: {}
servers:
  - url: https://api.piapi.ai
    description: Develop Env
security: []

```

# Create Task

> :::info
The API to create song from text prompts - supporting models like Udio and others!

#### Unit Pricing


music-u: $0.05 / generation

#### Examples
Check [here](/docs/music-api/music-task-examples) for different examples when using the Song API.
::::

> **Note:** The immediate response to this POST request typically contains the `task_id`. The actual song data (audio URL, etc.) is delivered later via the configured webhook when the task status becomes `completed`. Refer to the "Webhook Payload Example" section for the structure received upon task completion.

## OpenAPI

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v1/task:
    post:
      summary: Create Task
      deprecated: false
      description: >-
        :::info

        The API to create song from text prompts - supporting models like Udio
        and others!


        #### Unit Pricing



        music-u: $0.05 / generation


        #### Examples

        Check [here](/docs/music-api/music-task-examples) for different examples
        when using the Song API.

        ::::
      operationId: music-api/create-task
      tags:
        - Endpoints/Song(Udio)
      parameters: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              x-apidog-refs: {}
              x-apidog-orders:
                - model
                - task_type
                - input
                - config
              properties:
                model:
                  type: string
                  description: model of the music api
                  enum:
                    - music-u
                  x-apidog-enum:
                    - value: music-u
                      name: ''
                      description: ''
                task_type:
                  type: string
                  description: type of the task
                  enum:
                    - generate_music
                    - generate_music_custom
                  x-apidog-enum:
                    - value: generate_music
                      name: ''
                      description: ''
                    - value: generate_music_custom
                      name: ''
                      description: ''
                input:
                  type: object
                  properties:
                    prompt:
                      type: string
                      description: >-
                        prompt of the music, check
                        [Examples](/docs/music-api/music-task-examples)
                    negative_tags:
                      type: string
                      description: >-
                        negative tags of the music, seperate by comma, for
                        example 'pop,rock'
                    title:
                      type: string
                      description: title of the music
                    gpt_description_prompt:
                      type: string
                      description: use in generate_music only
                    seed:
                      type: number
                      description: >-
                        used in music-u only, check
                        [Examples](/docs/music-api/music-task-examples)
                    lyrics_type:
                      type: string
                      description: >-
                        used in music-u only, check
                        [Examples](/docs/music-api/music-task-examples)
                      enum:
                        - generate
                        - user
                        - instrumental
                      x-apidog-enum:
                        - value: generate
                          name: ''
                          description: >-
                            generate a song from gpt-description-prompt in
                            music-u
                        - value: user
                          name: ''
                          description: generate a song from exact prompt in music-u
                        - value: instrumental
                          name: ''
                          description: >-
                            generate a melody from gpt-description-prompt in
                            music-u
                  x-apidog-orders:
                    - prompt
                    - negative_tags
                    - gpt_description_prompt
                    - title
                    - lyrics_type
                    - seed
                  required:
                    - lyrics_type
                config:
                  type: object
                  properties:
                    webhook_config:
                      type: object
                      properties:
                        endpoint:
                          type: string
                        secret:
                          type: string
                      x-apidog-orders:
                        - endpoint
                        - secret
                  x-apidog-orders:
                    - webhook_config
              required:
                - model
                - task_type
                - input
            example:
              model: music-u
              task_type: generate_music
              input:
                negative_tags: veritatis
                gpt_description_prompt: magna in id in eu
                lyrics_type: instrumental
                seed: -25443934
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: Endpoints/Song(Udio)
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/675356/apis/api-11894276-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://api.piapi.ai
    description: Develop Env
security: []

```

# Webhook Payload Example (Completed Task)

> When a `music-u` task completes successfully, the API sends a payload to the configured webhook endpoint. The following is an example of the `data` object within that payload:

```json
{
  "task_id": "0153143f-8b80-4092-b01d-76829e1a16ed",
  "model": "music-u",
  "task_type": "generate_music",
  "status": "completed",
  "config": {
    "service_mode": "",
    "webhook_config": {
      "endpoint": "REDACTED_ENDPOINT",
      "secret": "REDACTED_SECRET"
    }
  },
  "input": {
    "gpt_description_prompt": "Playful melody for potty training In the song, use the voice: softFemale",
    "lyrics_type": "user",
    "negative_tags": "rock, metal, aggressive, harsh",
    "prompt": "Aaryan, Aaryan, time to go!\nGotta listen to your body, let it show.\nWhen you feel the urge, don't delay,\nAaryan, it's time to make your way!\n\nTo the potty, Aaryan, that's the place,\nSit right down, with a smile on your face.\nRelax and let it all come out,\nAaryan, you've got this, no need to pout!\n\nWash your hands, Aaryan, nice and clean,\nSoap and water, the best routine.\nYou're a big boy now, we're so proud,\nAaryan, your success, shout it out loud!\n\nPotty training's fun, Aaryan, you'll see,\nIt's a skill that will set you free.\nCelebrate each time you take a seat,\nAaryan, you're the best, can't be beat!",
    "seed": -1
  },
  "output": {
    "generation_id": "1151374f-8a80-4ad6-b766-6828bb0f460b",
    "songs": [
      {
        "id": "674541ff-aee4-49de-8d9f-73345ea8bc0b",
        "title": "Aaryan's Big Adventure",
        "image_path": "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/7c49c1ba-8e70-476f-2693-e988e7a9ae00/public",
        "lyrics": "Aaryan, Aaryan, time to go! Gotta listen to your body, let it show. When you feel the urge, don't delay, Aaryan, it's time to make your way!  To the potty, Aaryan, that's the place, Sit right down, with a smile on your face. Relax and let it all come out, Aaryan, you've got this, no need to pout!  Wash your hands, Aaryan, nice and clean, Soap and water, the best routine. You're a big boy now, we're so proud, Aaryan, your success, shout it out loud!  Potty training's fun, Aaryan, you'll see, It's a skill that will set you free. Celebrate each time you take a seat, Aaryan, you're the best, can't be beat!",
        "prompt": "Playful melody for potty training In the song, use the voice: softFemale",
        "song_path": "https://storage.googleapis.com/udio-artifacts-c33fe3ba-3ffe-471f-92c8-5dfef90b3ea3/samples/972772c8c9e6446f8ca169fbd440e98c/1/The%2520Untitled.mp3",
        "duration": 131.114666666667,
        "finished": true,
        "tags": [
          "female vocalist",
          "pop",
          "warm",
          "melodic",
          "mellow",
          "playful",
          "soft"
        ],
        "error_type": null,
        "error_code": null,
        "error_detail": null
      },
      {
        "id": "b9bf0622-682d-4193-9547-7b0a2a71b3e8",
        "title": "Time to Shine, Aaryan",
        "image_path": "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/8f79ac64-e803-4b6e-213d-c15ca434f200/public",
        "lyrics": "Aaryan, Aaryan, time to go! Gotta listen to your body, let it show. When you feel the urge, don't delay, Aaryan, it's time to make your way!  To the potty, Aaryan, that's the place, Sit right down, with a smile on your face. Relax and let it all come out, Aaryan, you've got this, no need to pout!  Wash your hands, Aaryan, nice and clean, Soap and water, the best routine. You're a big boy now, we're so proud, Aaryan, your success, shout it out loud!  Potty training's fun, Aaryan, you'll see, It's a skill that will set you free. Celebrate each time you take a seat, Aaryan, you're the best, can't be beat!",
        "prompt": "Playful melody for potty training In the song, use the voice: softFemale",
        "song_path": "https://storage.googleapis.com/udio-artifacts-c33fe3ba-3ffe-471f-92c8-5dfef90b3ea3/samples/972772c8c9e6446f8ca169fbd440e98c/2/The%2520Untitled.mp3",
        "duration": 131.114666666667,
        "finished": true,
        "tags": [
          "female vocalist",
          "pop",
          "melodic",
          "love",
          "teen pop",
          "uplifting",
          "energetic",
          "rhythmic"
        ],
        "error_type": null,
        "error_code": null,
        "error_detail": null
      }
    ]
  },
  "meta": {
    "created_at": "2025-04-25T17:07:45.765122491Z",
    "started_at": "2025-04-25T17:07:46.618823883Z",
    "ended_at": "2025-04-25T17:10:29.2624881Z",
    "usage": {
      "type": "point",
      "frozen": 500000,
      "consume": 500000
    },
    "is_using_private_pool": false
  },
  "detail": null,
  "logs": null,
  "error": {
    "code": 0,
    "raw_message": "",
    "message": "",
    "detail": null
  }
}
```

> **Key fields for webhook processing:**
> *   `status`: Will be `"completed"` (or similar success status like `"complete"`).
> *   `output.songs`: An array containing the generated song(s)/variation(s). The webhook handler should primarily use `song_path` from the first object (`output.songs[0]`) for the main audio URL and process subsequent objects as variations.
> *   `error`: Should indicate no error (e.g., `code: 0`).




