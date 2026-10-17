<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;
use Symfony\Component\Console\Attribute\AsCommand;

/**
 * `php artisan serve`, but with PHP upload limits raised so the admin can
 * accept large cover images and process videos. PHP's defaults
 * (upload_max_filesize=2M, post_max_size=8M) can't be changed at runtime,
 * so they are passed to the built-in server as -d flags instead.
 *
 * Only affects local `artisan serve`. In production, set the same values
 * in php.ini / your host's PHP settings (and nginx client_max_body_size).
 */
#[AsCommand(name: 'serve')]
class ServeCommand extends BaseServeCommand
{
    protected function serverCommand()
    {
        $videoMb = (int) ceil(config('portfolio.uploads.video_max_kb', 204800) / 1024);
        $postMb = $videoMb + 50;   // room for cover + gallery images in the same request

        $command = parent::serverCommand();
        $binary = array_shift($command);

        return array_merge([
            $binary,
            '-d', "upload_max_filesize={$videoMb}M",
            '-d', "post_max_size={$postMb}M",
            '-d', 'max_file_uploads=50',
            '-d', 'memory_limit=512M',
            '-d', 'max_execution_time=300',
            '-d', 'max_input_time=300',
        ], $command);
    }
}
