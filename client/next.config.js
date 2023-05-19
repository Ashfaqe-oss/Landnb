/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
                'res.cloudinary.com',
                'avatars.githubusercontent.com',
                'lh3.googleusercontent.com',
                'a0.muscache.com',
            ] //need to resolbe where images come from to use next Image component
    }
}

module.exports = nextConfig